import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
	{
		title: <>Made for all</>,
		imageUrl: 'img/undraw_docusaurus_react.svg',
		description: (
			<>
				We built Vaken to help other hackathon organizers to get started with an advanced
				registration system that could also integrate with events, NFC, and more. We want you to
				focus on other things, not your dev tools.
			</>
		),
	},
	{
		title: <>Modern Tech Stack</>,
		imageUrl: 'img/undraw_docusaurus_tree.svg',
		description: (
			<>
				Vaken is built with React, GraphQL, Express, TypeScript, and MongoDB to ensure sustained
				development.
			</>
		),
	},
	{
		title: <>Pluggable</>,
		imageUrl: 'img/undraw_docusaurus_mountain.svg',
		description: (
			<>
				Vaken has been designed with a plugin architecture–either install the plugins you want from
				our list in the <code>plugins</code> folder in the documentation.
			</>
		),
	},
];

function Feature({ imageUrl, title, description }) {
	const imgUrl = useBaseUrl(imageUrl);
	return (
		<div className={classnames('col col--4', styles.feature)}>
			{imgUrl && (
				<div className="text--center">
					<img className={styles.featureImage} src={imgUrl} alt={title} />
				</div>
			)}
			<h3>{title}</h3>
			<p>{description}</p>
		</div>
	);
}

function Home() {
	const context = useDocusaurusContext();
	const { siteConfig = {} } = context;
	return (
		<Layout
			title={`Hello from ${siteConfig.title}`}
			description="Description will go into a meta tag in <head />">
			<header className={classnames('hero hero--primary', styles.heroBanner)}>
				<div className="container">
					<h1 className="hero__title">{siteConfig.title}</h1>
					<p className="hero__subtitle">{siteConfig.tagline}</p>
					<div className={styles.buttons}>
						<Link
							className={classnames(
								'button button--outline button--secondary button--lg',
								styles.getStarted
							)}
							to={useBaseUrl('docs/installation')}>
							Get Started
						</Link>
					</div>
				</div>
			</header>
			<main>
				{features && features.length && (
					<section className={styles.features}>
						<div className="container">
							<div className="row">
								{features.map((props, idx) => (
									<Feature key={idx} {...props} />
								))}
							</div>
						</div>
					</section>
				)}
			</main>
		</Layout>
	);
}

export default Home;
