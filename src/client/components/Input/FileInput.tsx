import React, { FC, useState, ChangeEvent, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { InputProps } from './TextInput';
import { AuthContext } from '../../contexts/AuthContext';
import { useSignedUploadUrlMutation, useSignedReadUrlQuery } from '../../generated/graphql';
import STRINGS from '../../assets/strings.json';
import { HeaderButton } from '../Buttons/HeaderButton';

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
`;

export const FileInput: FC<InputProps> = props => {
	const [file, setFile] = useState<File>();
	const [getSignedUploadUrl] = useSignedUploadUrlMutation();
	const { value, setState } = props;
	const [counter, setCounter] = useState(0);
	const fileReadUrlQuery = useSignedReadUrlQuery({ variables: { input: value } });
	const { data: { signedReadUrl = '' } = {} } = fileReadUrlQuery || {};
	const user = useContext(AuthContext);

	const onChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
		if (!e.target.files) throw new Error('Files was null');
		setFile(e.target.files[0]);
	};

	useEffect(() => {
		if (!file || !user.id) return;

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
			.then(res => {
				if (res.ok) return setState(user.id);
				throw new Error('Failed in upload to cloud storage');
			})
			.catch(err => {
				throw new Error(err);
			});
	}, [file, getSignedUploadUrl, setState, user]);

	// Generate UID
	useEffect(() => {
		setCounter((globalCounter += 1));
	}, []);

	return (
		<Container>
			<FileInputEl className="input" id={`file-${counter}`} type="file" onChange={onChange} />
			<FileLabelEl className="label" htmlFor={`file-${counter}`}>
				{/* eslint-disable-next-line react/jsx-one-expression-per-line */}
				Upload {signedReadUrl ? 'new' : 'a'} resume
			</FileLabelEl>
			{signedReadUrl ? (
				<HeaderButton
					width="fit-content"
					fontSize="1.2rem"
					onClick={() => void window.open(signedReadUrl, '_blank', 'noopener')}>
					View uploaded resume
				</HeaderButton>
			) : null}
		</Container>
	);
};

export default FileInput;
