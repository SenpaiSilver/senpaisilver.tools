import React, { useState } from "react";

import "@app/string-processing/string.css";

export default function StringProcessing() {
    const [processQueue, setProcessQueue] = useState<any[]>([]);
    const [inputString, setInputString] = useState<string>("");
    const [outputString, setOutputString] = useState<string>("");

    return (
        <div>
            <h1>String processing</h1>

            <div className="inout">
                <textarea onChange={(e) => setInputString(e.target.value)} defaultValue={inputString}></textarea>
                <span className="spacer">&gt;</span>
                <textarea readOnly={true} value={outputString}></textarea>
            </div>

            <h2>Queue</h2>
            <div className="">
                <ul>
                    {(processQueue || []).map((queued_item) => {
                        return (<li>
                            {queued_item as string}
                        </li>);
                    })}
                </ul>
            </div>

            <h2>Features</h2>
            <div className="controls">
                <ul>
                    <li>
                        <button type="button">+</button> Base64 Encode
                    </li>
                    <li>
                        <button type="button">+</button> Base64 Decode
                    </li>
                    <li>
                        <button type="button">+</button> URI Encode
                    </li>
                    <li>
                        <button type="button">+</button> URI Decode
                    </li>
                </ul>
            </div>

        </div>
    );
}
