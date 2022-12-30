import React, { useState, useEffect } from "react";

import {
	PdfLoader,
	PdfHighlighter,
	Tip,
	Highlight,
	Popup,
	AreaHighlight,
} from "react-pdf-highlighter";

import { Sidebar } from "./Sidebar";

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
	document.location.hash.slice("#highlight-".length);

const resetHash = () => {
	document.location.hash = "";
};

const HighlightPopup = ({ comment }) => {
	return (
		<div className="Highlight__popup">
			{comment.emoji} {comment.text}
		</div>
	);
};

const App = ({ inurl }) => {
	console.log(inurl);
	const initialUrl = inurl;
	const [url, setUrl] = useState(initialUrl);
	const list = ["Title", "Author"];
	const [active, setActive] = useState(0);
	const [highlights, setHighlights] = useState([]);

	const resetHighlights = () => {
		setHighlights([]);
	};

	const getHighlightById = (id) => {
		return highlights.find((highlight) => highlight.id === id);
	};

	const scrollToHighlightFromHash = () => {
		const highlight = getHighlightById(parseIdFromHash());

		if (highlight) {
			scrollViewerTo(highlight);
		}
	};

	useEffect(() => {
		window.addEventListener("hashchange", scrollToHighlightFromHash, false);
	}, []);

	const addHighlight = (highlight) => {
		console.log("Saving highlight", highlight);

		setHighlights([
			{ ...highlight, id: getNextId(), index: active },
			...highlights,
		]);
	};

	function updateHighlight(highlightId, position, content) {
		console.log("Updating highlight", highlightId, position, content);

		setHighlights(
			highlights.map((h) => {
				const {
					id,
					position: originalPosition,
					content: originalContent,
					...rest
				} = h;
				return id === highlightId
					? {
							id,
							position: { ...originalPosition, ...position },
							content: { ...originalContent, ...content },
							...rest,
					  }
					: h;
			})
		);
	}

	return (
		<div className="App" style={{ display: "flex", height: "100vh" }}>
			<Sidebar
				list={list}
				active={active}
				setActive={setActive}
				highlights={highlights}
				resetHighlights={resetHighlights}
			/>
			<div
				style={{
					height: "100vh",
					width: "75vw",
					position: "relative",
				}}
			>
				<PdfLoader url={url}>
					{(pdfDocument) => (
						<PdfHighlighter
							pdfDocument={pdfDocument}
							enableAreaSelection={(event) => event.altKey}
							onScrollChange={resetHash}
							// pdfScaleValue="page-width"
							scrollRef={(scrollTo) => {
								scrollViewerTo = scrollTo;
								scrollToHighlightFromHash();
							}}
							onSelectionFinished={(
								position,
								content,
								hideTipAndSelection,
								transformSelection
							) => (
								<Tip
									onOpen={transformSelection}
									onConfirm={(comment) => {
										addHighlight({ content, position, comment });
										hideTipAndSelection();
									}}
								/>
							)}
							highlightTransform={(
								highlight,
								index,
								setTip,
								hideTip,
								viewportToScaled,
								screenshot,
								isScrolledTo
							) => {
								const isTextHighlight = !Boolean(
									highlight.content && highlight.content.image
								);

								const component = isTextHighlight ? (
									<Highlight
										isScrolledTo={isScrolledTo}
										position={highlight.position}
										comment={highlight.comment}
										className="show"
									/>
								) : (
									<AreaHighlight
										isScrolledTo={isScrolledTo}
										highlight={highlight}
										onChange={(boundingRect) => {
											updateHighlight(
												highlight.id,
												{ boundingRect: viewportToScaled(boundingRect) },
												{ image: screenshot(boundingRect) }
											);
										}}
									/>
								);

								return (
									<Popup
										popupContent={<HighlightPopup {...highlight} />}
										onMouseOver={(popupContent) =>
											setTip(highlight, (highlight) => popupContent)
										}
										onMouseOut={hideTip}
										key={index}
										children={component}
									/>
								);
							}}
							highlights={highlights}
						/>
					)}
				</PdfLoader>
			</div>
		</div>
	);
};

export default App;
