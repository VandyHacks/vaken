import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';

interface Props {
	value: boolean;
}

const Checkmark = styled('div')`
    ${({ value }: Props) =>
    value
        ? `background-color: ${STRINGS.DARK_TEXT_COLOR}`
        : `background-color: ${STRINGS.ACCENT_COLOR}`}
    height: 1.5rem;
    width: 1.5rem;
    background-color: ${STRINGS.ACCENT_COLOR};
    border-radius: 50%;
    display: inline-block;
`;
 
export default Checkmark;

// Copyright (c) 2019 Vanderbilt University