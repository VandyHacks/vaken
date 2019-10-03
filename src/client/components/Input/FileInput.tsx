import React, { FC, useState, ChangeEvent, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { InputProps } from './TextInput';
import { AuthContext } from '../../contexts/AuthContext';
import { useSignedUploadUrlMutation, useSignedReadUrlQuery } from '../../generated/graphql';
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

const FileLabelEl = styled.label`
	cursor: pointer;
	font-size: 1.2rem;
	padding: 0.6rem 2rem;
	background: ${STRINGS.ACCENT_COLOR};
	width: fit-content;
	color: white;
	border-radius: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 1rem;

	&:hover,
	&:focus,
	&:active,
	input:focus + & {
		box-shadow: 0px 0px 20px 0px rgba(0, 0, 255, 0.67);
	}
`;

const Container = styled.div`
	display: flex;
	flex-flow: row wrap;

	& label {
		margin-top: 0.5rem;
	}

	& a {
		cursor: pointer;
	}
`;

export const FileInput: FC<InputProps> = props => {
	const [file, setFile] = useState<File>();
	const [getSignedUploadUrl] = useSignedUploadUrlMutation();
	const [uploaded, setUploaded] = useState(false);
	const { value, setState } = props;
	const [counter, setCounter] = useState(0);
	const fileReadUrlQuery = useSignedReadUrlQuery({ variables: { input: value } });
	const { data: { signedReadUrl = '' } = {} } = fileReadUrlQuery || {};
	const user = useContext(AuthContext);

	const onChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
		if (!e.target.files) throw new Error('Files was null');
		setFile(e.target.files[0]);
		setUploaded(false);
	};

	useEffect(() => {
		if (!file || !user.id || uploaded) return;

		setUploaded(true);
		getSignedUploadUrl({ variables: { input: user.id } })
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
			.then(async res => {
				if (res.ok) return setState(user.id);
				throw new Error(`Failed in upload to cloud storage: ${await res.text()}`);
			})
			.catch(err => {
				throw new Error(err);
			});
	}, [file, getSignedUploadUrl, setState, user, uploaded]);

	// Generate UID
	useEffect(() => {
		setCounter((globalCounter += 1));
	}, []);

	return (
		<Container>
			<FileInputEl
				className="input"
				accept=".pdf"
				id={`file-${counter}`}
				type="file"
				onChange={onChange}
			/>
			<FileLabelEl className="label" htmlFor={`file-${counter}`}>
				{/* eslint-disable-next-line react/jsx-one-expression-per-line */}
				Upload {signedReadUrl ? 'new' : 'a'} resume
			</FileLabelEl>
			{signedReadUrl ? (
				<a href={signedReadUrl} target="_blank" rel="noopener noreferrer">
					<FileLabelEl>View uploaded resume</FileLabelEl>
				</a>
			) : null}
		</Container>
	);
};

export default FileInput;
