import Link from 'next/link';
import React from 'react';

export default function Home() {
	return (
		<div className="flex items-center justify-center flex-col">
			Aca se lista una pequena demo, de las distintas integraciones de MP
			<div className="flex flex-col">
				<Link className="underline" href="./secure_fields">
					Secure Fields
				</Link>
				<Link className="underline" href="./bricks">
					Bricks no React
				</Link>
				<Link className="underline" href="./bricks_react">
					Bricks React Package
				</Link>
			</div>
		</div>
	);
}
