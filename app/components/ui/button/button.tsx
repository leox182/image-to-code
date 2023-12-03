interface Props {
	children: any;
	[x: string]: any;
}

export default function Button({ children, ...others }: Props) {
	return (
		<button
			className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-300 mb-2 me-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
			{...others}
		>
			{children}
		</button>
	);
}
