type HTMLInputTypeAttribute = 'email' | 'text' | 'url';
type textAreaInputType = 'textarea';

interface Props {
	label?: string;
	type?: HTMLInputTypeAttribute | textAreaInputType;
	id?: string;
	className?: string;
	[x: string]: any;
}

export default function InputBlock({ label, type = 'text', id, className, ...others }: Props) {
	const inputStyles =
		'mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';

	const labelStyles = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';

	return (
		<div className={className}>
			<label className={labelStyles}>{label}</label>
			{type === 'textarea' ? (
				<textarea id={id} className={inputStyles} {...others} />
			) : (
				<input type={type} id={id} className={inputStyles} {...others} />
			)}
		</div>
	);
}
