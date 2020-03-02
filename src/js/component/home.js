import React, { useEffect, useState } from "react";
import { Widget } from "@uploadcare/react-widget";
import Select from "react-select";
//create your first component
const defaultImg = {
	uuid: null,
	description: "",
	url: "",
	category: null,
	tags: ""
};

export function Home() {
	const [start, setStart] = useState(0);
	const [images, setImages] = useState([]);
	const [categories, setCategories] = useState([]);
	const [tags, setTags] = useState([]);
	const [filterTags, setFilterTags] = useState([]);
	const [filterCategories, setFilterCategories] = useState([]);
	const [widgetStep, setWidgetStep] = useState(0);
	const [pictureData, setPictureData] = useState(defaultImg);

	const getImages = () => {
		fetch("api/get_files.js?start=" + start)
			.then(resp => resp.json())
			.then(data => setImages(data))
			.catch(err => console.error(err));
	};

	useEffect(() => {
		getImages();
	}, []);
	return (
		<div className="container">
			{widgetStep === 0 ? (
				<button
					className="btn btn-light my-2 form-control"
					onClick={() => setWidgetStep(1)}>
					<i className="fas fa-plus-circle" />
					Add new picture
				</button>
			) : widgetStep == 1 ? (
				<div className="p-3 upload">
					<label htmlFor="file">Pick your file</label>{" "}
					<Widget
						className="form-control"
						previewStep={true}
						publicKey={"84a750524a2ee4b61059"}
						validators={[
							fileInfo => {
								console.log("Some validation", fileInfo);
								if (fileInfo.size > 400000) {
									alert("File cannot be bigger than 400kb");
									throw new Error(
										"File cannot be bigger than 400kb"
									);
								}
							}
						]}
						onFileSelect={file => {
							console.log("File changed: ", file);

							if (file) {
								file.progress(info =>
									console.log(
										"File progress: ",
										info.progress
									)
								);
								file.done(info => {
									console.log("Image uploded", info);
								});
							}
						}}
						onChange={info => {
							console.log("Upload completed:", info);
							getImages();
						}}
					/>
				</div>
			) : null}
			<div className="gallery card-columns">
				{images.length === 0 && <p>No files found</p>}
				{images.map(img => (
					<div key={img.uuid} className="card">
						<div
							className="card-img-top w-100"
							style={{
								backgroundImage: `url('${img.url}')`,
								height: "250px"
							}}>
							<ul className="icons">
								<li
									className="pointer"
									onClick={e => {
										const _delete = window.confirm(
											"Are you sure you want to delete this image"
										);
										if (_delete)
											fetch(
												"api/delete.js?uuid=" +
													img.uuid,
												{
													method: "POST"
												}
											)
												.then(resp => {
													if (resp.status === 200)
														setImages(
															images.filter(
																i =>
																	i.uuid !==
																	img.uuid
															)
														);
													return resp.json();
												})
												.catch(
													err =>
														console.error(err) ||
														alert(
															"There was an error deleting the image"
														)
												);
									}}>
									<i className="fas fa-trash" />
								</li>
								<li
									className="pointer"
									onClick={e => window.open(img.url)}>
									<i className="fas fa-external-link-alt" />
								</li>
							</ul>
						</div>
						<div className="card-block p-2">
							<p className="card-text">{img.description}</p>
							<h5 className="card-title">{img.category}</h5>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
