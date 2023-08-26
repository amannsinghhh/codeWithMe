import React, { useEffect, useRef } from "react";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';
import axios from "axios";
import ACTIONS from "../action";


const Editor = ({ socketRef, roomID }) => {
    const editorRef = useRef(null);
    const [code, setCode] = useState("console.log('Start Writing!');");
    const [output, setOutput] = useState("");

    const runCode = async () => {
        try {
            editorRef.current = setOutput("Running...");

            const response = await axios.post(
                "https://runkit.io/api/run/1.0.0",
                { code },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setOutput(response.data);
        } catch (error) {
            setOutput("Error: " + error.message);
        }
        editorRef.current.on('change', (instance, changes) => {
            console.log('changes', changes)
            const { origin } = changes;
            const code = instance.getValue();
            if (origin !== 'setValue') {
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomID,
                    code,
                });
            }
            console.log();
        })

    };
    useEffect(() => {
        if (socketRef.current)
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue();
                }
            })
    }, [socketRef.current])

    return (
        <div>
            <CodeMirror
                value={code}
                height="650px"
                theme={vscodeDark}
                options={{
                    mode: { name: javascript(), json: true },
                    theme: 'material',
                    lineNumbers: true,
                    autocompletion: true,
                    closeBrackets: true,

                }}
                onChange={(editor, data, value) => {
                    setCode(value);
                }}
            />
            <button className="btn runbtn" onClick={runCode}>Run</button>
            <h2 className="outputtxt">Output:</h2>
            <pre>{output}</pre>
        </div>
    );
};

export default Editor;

