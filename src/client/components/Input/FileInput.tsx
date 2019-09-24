import React, { FC, useState, ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';
import { InputProps } from './TextInput';
import { useSignedUploadUrlMutation } from '../../generated/graphql';
import STRINGS from '../../assets/strings.json';

let globalCounter = 0;

const FileInputEl = styled.input`
	/* Hide the input element itself */
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
`;

/*
marginTop="0"
			marginBottom="0"
			marginRight="0.1rem"
			width={width || 'auto'}
			paddingLeft="2rem"
			paddingRight="2rem"
			paddingTop="0.6rem"
			paddingBottom="0.6rem"
			height="auto"
			color="white"
			fontSize="1.4rem"
			background={STRINGS.ACCENT_COLOR}
			glowColor="rgba(0, 0, 255, 0.67)"
			onClick={clickHandler}>
			{inAction ? <Spinner color="white" /> : children}
*/

const FileLabelEl = styled.label`
	cursor: pointer;
	font-size: 1.2rem;
	padding: 0.6rem 2rem;
	background: ${STRINGS.ACCENT_COLOR};
	width: fit-content;
	color: white;
	border-radius: 6px;

	&:hover,
	&:focus,
	&:active {
		box-shadow: 0px 0px 20px 0px rgba(0, 0, 255, 0.67);
	}
`;

export const FileInput: FC<InputProps> = props => {
	const [file, setFile] = useState<File>();
	const [getSignedUploadUrl] = useSignedUploadUrlMutation();
	const { setState } = props;
	const [counter, setCounter] = useState(0);

	const onChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
		if (!e.target.files) throw new Error('Files was null');
		setFile(e.target.files[0]);
		// Create the filename
	};

	useEffect(() => {
		if (!file) return;

		getSignedUploadUrl({ variables: { input: file.name } })
			.then(uploadUrl => {
				if (!uploadUrl || !uploadUrl.data)
					throw new Error('Server did not return signed upload url');
				return fetch(uploadUrl.data.signedUploadUrl, {
					body: file,
					headers: {
						'Content-Type': file.type,
					},
					method: 'PUT',
				});
			})
			.then(res => res.json())
			.then(json => setState(json.url))
			.catch(err => {
				throw new Error(err);
			});
	}, [file, getSignedUploadUrl, setState]);

	// Generate UID
	useEffect(() => {
		setCounter((globalCounter += 1));
	}, []);

	return (
		<>
			<FileInputEl className="input" name={`file-${counter}`} type="file" onChange={onChange} />
			<FileLabelEl className="label" htmlFor={`file-${counter}`}>
				Upload a file
			</FileLabelEl>
		</>
	);
};

export default FileInput;
