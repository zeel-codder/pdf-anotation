import React from "react";

const updateHash = (highlight) => {
	document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
	list,
	active,
	setActive,
	highlights,
	resetHighlights,
}) {
	return (
		<div className="sidebar" style={{ width: "25vw" }}>
			<div className="description" style={{ padding: "1rem" }}>
				<h4
					style={{ marginBottom: "1rem", cursor: "pointer" }}
					onClick={() => {
						window.location.href = "/";
					}}
				>
					{" "}
					{"<"} Back
				</h4>
				<h2 style={{ marginBottom: "1rem" }}>highlighter</h2>
			</div>
			<div
				className="description"
				style={{ padding: "1rem", cursor: "pointer" }}
			>
				{list.map((value, index) => {
					if (index == active) {
						return (
							<h4 style={{ textWidth: "bold", color: "black" }}>{value}</h4>
						);
					}

					return <h4 onClick={() => setActive(index)}>{value}</h4>;
				})}
			</div>

			<ul className="sidebar__highlights">
				<hr></hr>
				<div className="description" style={{ padding: "1rem" }}>
					<h2>Notes</h2>
				</div>
				{highlights.map((highlight, index) => (
					<li
						key={index}
						className="sidebar__highlight"
						onClick={() => {
							updateHash(highlight);
						}}
					>
						<div>
							<strong>{highlight.comment.text}</strong>
							{highlight.content.text ? (
								<blockquote style={{ marginTop: "0.5rem" }}>
									{`${highlight.content.text.slice(0, 90).trim()}…`}
								</blockquote>
							) : null}
							{highlight.content.image ? (
								<div
									className="highlight__image"
									style={{ marginTop: "0.5rem" }}
								>
									<img src={highlight.content.image} alt={"Screenshot"} />
								</div>
							) : null}
						</div>
						<div className="highlight__location">
							Page {highlight.position.pageNumber}
						</div>
						<div>x: {Math.floor(highlight.position.boundingRect.x1)}</div>
						<div>Y: {Math.floor(highlight.position.boundingRect.y1)}</div>
						<div>
							Width:{" "}
							{Math.floor(highlight.position.boundingRect.x2) -
								Math.floor(highlight.position.boundingRect.x1)}
						</div>
						<div>
							Height:{" "}
							{Math.floor(highlight.position.boundingRect.y2) -
								Math.floor(highlight.position.boundingRect.y1)}
						</div>
						<div>Category: {list[highlight.index]}</div>
					</li>
				))}
			</ul>

			{highlights.length > 0 ? (
				<div style={{ padding: "1rem" }}>
					<button onClick={resetHighlights}>Reset highlights</button>
				</div>
			) : null}
		</div>
	);
}
