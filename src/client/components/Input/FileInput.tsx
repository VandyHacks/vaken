import React, { FC, useState, ChangeEvent } from 'react';

export const FileInput: FC = () => {
	const [, setFile] = useState();

	const onChange: (e: ChangeEvent<HTMLInputElement>) => void = (
		e: ChangeEvent<HTMLInputElement>
	) => {
		if (!e.target.files) throw new Error('Files was null');
		setFile(e.target.files[0]);
	};

	return <input type="file" onChange={onChange} />;
};

export default FileInput;
