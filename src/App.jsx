import React, { useState } from "react";
import "./style/App.css";
import Pdf from "./Pdf";

export default function App() {
	const [url, setUrl] = useState("");
	const [show, setShow] = useState(false);

	if (!show) {
		return (
			<div>
				<h1 style={{ color: "black" }}>Documents</h1>
				<input
					type="url"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
				/>
				{url && <button onClick={() => setShow(true)}>Go</button>}
			</div>
		);
	}

	return <Pdf inurl={url}></Pdf>;
}
