interface Props {
	children: any;
	[x: string]: any;
}

export default function Button({ children, ...others }: Props) {
	return (
		<button
			className="rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-primary-400 dark:hover:bg-primary-300 dark:focus:ring-blue-800"
			{...others}
		>
			{children}
		</button>
	);
}
