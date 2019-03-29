import { registerEnumType } from 'type-graphql';

enum Ethnicity {
	HispanicOrLatino = 'Hispanic or Latino',
	NotHispanicOrLatino = 'Not Hispanic or Latino',
}

registerEnumType(Ethnicity, {
	name: 'Ethnicity',
});

export default Ethnicity;

// Copyright (c) 2019 Vanderbilt University
