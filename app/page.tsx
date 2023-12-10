'use client';
import { ChangeEvent, useState } from 'react';

import Form from '@/components/form/form';
import Spinner from '@ui/spinner/spinner';
import DragAndDrop from './components/drag-and-drop/drag-and-drop';
import Footer from './components/footer/footer';
import Aside from './components/aside/aside';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useSearchParams } from 'next/navigation';
import {
	FRAMEWORK_CSS_PARAM as frameworkCSSParam,
	FRAMEWORK_UI_PARAM as frameworkUIParam,
	VANILLA_MODE_PARAM as vanillaModeParam,
} from './lib/variables';
import { Copy } from './components/icons';
import { Button } from './components/ui';

const STEPS = {
	INITIAL: 'INITIAL',
	LOADING: 'LOADING',
	PREVIEW: 'PREVIEW',
	ERROR: 'ERROR',
};

async function* streamReader(res: Response) {
	const reader = res.body?.getReader();
	const decoder = new TextDecoder();

	if (reader == null) return;

	while (true) {
		const { done, value } = await reader.read();
		const chunk = decoder.decode(value);
		yield chunk;
		if (done) break;
	}
}

const filetToBase64 = (file: File) => {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});
};

const HTMLExample = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selection Controls</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>
<body class="bg-gray-100 font-sans leading-normal tracking-normal">

<div class="px-8 py-12">
    <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-semibold mb-8">Selection controls</h2>

        <div class="mb-8">
            <h3 class="text-xl font-semibold mb-4">Types</h3>
            <div class="grid grid-cols-3 gap-6">
                
                <div class="p-6 shadow-lg rounded-lg bg-white flex flex-col items-center">
                    <div class="mb-2">
                        <i class="text-3xl text-blue-600 far fa-check-circle"></i>
                        <i class="text-3xl text-gray-400 far fa-square"></i>
                    </div>
                    <p class="mt-2 text-sm font-semibold">Checkboxes</p>
                </div>
                
                <div class="p-6 shadow-lg rounded-lg bg-white flex flex-col items-center">
                    <div class="mb-2">
                        <i class="text-3xl text-blue-600 fas fa-dot-circle"></i>
                        <i class="text-3xl text-gray-400 far fa-circle"></i>
                    </div>
                    <p class="mt-2 text-sm font-semibold">Radio buttons</p>
                </div>
                
                <div class="p-6 shadow-lg rounded-lg bg-white flex flex-col items-center">
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider round"></span>
                    </label>
                    <p class="mt-2 text-sm font-semibold">Toggle-Switch</p>
                </div>
                
            </div>
        </div>
        
        <div class="mb-8">
            <h3 class="text-xl font-semibold mb-4">Choice chips</h3>
            <div class="flex">
                <a href="#" class="mr-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow">Colors</a>
                <a href="#" class="mr-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-full shadow">Shapes</a>
                <a href="#" class="mr-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-full shadow">Textures</a>
            </div>
        </div>
        
        <div class="mb-8">
            <h3 class="text-xl font-semibold mb-4">Multi-select chips</h3>
            <div class="flex">
                <a href="#" class="mr-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-full shadow">silver</a>
                <a href="#" class="mr-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-full shadow">blue</a>
                <a href="#" class="mr-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow"><i class="far fa-check-circle mr-1"></i>fuchsia</a>
                <a href="#" class="mr-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow">purple</a>
                <a href="#" class="mr-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-full shadow">black</a>
                <a href="#" class="mr-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-full shadow">yellow</a>
            </div>
        </div>
    </div>
</div>

</body>
</html>
`;

export default function Home() {
	const [result, setResult] = useState('');
	const [step, setStep] = useState(STEPS.INITIAL);
	const [hasCodeView, setHasCodeView] = useState(false);
	const [imagePreviewSource, setImagePreviewSource] = useState('');

	const optionParams = useSearchParams();
	const isVanillaMode = optionParams.get(vanillaModeParam) === 'true';
	const uiFramework = optionParams.get(frameworkUIParam) || '';
	const cssFramework = optionParams.get(frameworkCSSParam) || '';

	const transformToCode = async (url: string) => {
		if (!url) return;
		setResult('');
		setImagePreviewSource(url);
		setStep(STEPS.LOADING);
		const res = await fetch('/api/generate-code-from-image', {
			method: 'POST',
			body: JSON.stringify({ url, isVanillaMode, uiFramework, cssFramework }),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!res.ok || res.body == null) {
			setStep(STEPS.ERROR);
			throw new Error('Error al generar el código');
		}

		setStep(STEPS.PREVIEW);

		for await (const chunk of streamReader(res)) {
			setResult((prevResult) => prevResult + chunk);
		}
	};

	const transformImageToCode = async (file: File) => {
		const img = await filetToBase64(file);
		await transformToCode(img);
	};

	const transformUrlToCode = async (url: string) => {
		await transformToCode(url);
	};

	const copyCode = () => {
		navigator.clipboard
			.writeText(result)
			.then(() => {
				alert(`Texto copiado al portapapeles`);
			})
			.catch((err) => {
				console.error('Error al copiar al portapapeles', err);
			});
	};

	return (
		<div className="grid grid-cols-[350px_1fr] bg-gradient-to-t from-primary-200 via-neutral-50 to-slate-300 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700">
			<Aside imagePreviewSource={imagePreviewSource} />
			<main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col p-8  dark:bg-primary-950">
				<h1 className="my-12 text-center text-5xl font-extrabold uppercase text-primary-900">
					Generate code from image
				</h1>
				{step === STEPS.INITIAL && (
					<section className="mx-auto flex w-full flex-1 flex-col gap-8 md:w-1/2">
						<DragAndDrop transformImageToCode={transformImageToCode} />
						<Form transformUrlToCode={transformUrlToCode} />
					</section>
				)}
				{step === STEPS.LOADING && (
					<section className="mx-auto flex w-full flex-1 flex-col gap-8 md:w-1/2">
						<div className="">
							<Spinner />
						</div>
					</section>
				)}
				{step === STEPS.ERROR && (
					<section className="mx-auto flex w-full flex-1 flex-col gap-8 md:w-1/2">
						<span className="text-center text-2xl font-bold">Ups! Something has gone wrong</span>
						<div className="mx-auto overflow-hidden rounded-lg">
							<img src="/assets/mr-incredible.webp" className="aspect-square object-cover" />
						</div>
						<Button onClick={() => setStep(STEPS.INITIAL)}>Vuele a inicio</Button>
					</section>
				)}

				{step === STEPS.PREVIEW && (
					<section className="relative mx-auto h-[65vh] w-full overflow-y-auto rounded-2xl md:w-5/6">
						{!hasCodeView ? (
							<iframe srcDoc={result} className="h-full w-full" />
						) : (
							<SyntaxHighlighter
								className="h-full w-full"
								language="HTML"
								style={dark}
								showLineNumbers
							>
								{result}
							</SyntaxHighlighter>
						)}
						<div className="absolute bottom-8 right-8 flex gap-4">
							<div className="inline-flex rounded-md shadow-sm" role="group">
								<label className="rounded-s-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500">
									<input
										type="radio"
										name="viewType"
										className="hidden"
										onChange={() => setHasCodeView(false)}
									/>
									Preview
								</label>
								<label className="rounded-e-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500">
									<input
										type="radio"
										name="viewType"
										className="hidden"
										onChange={() => setHasCodeView(true)}
									/>
									Code
								</label>
							</div>
							<div>
								<button
									onClick={copyCode}
									className="me-2 inline-flex items-center rounded-lg bg-blue-700 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
								>
									<Copy />
									<span className="sr-only">Copy code</span>
								</button>
							</div>
							<div>
								<button
									onClick={() => transformUrlToCode(imagePreviewSource)}
									className="me-2 inline-flex items-center rounded-lg bg-blue-700 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										fill="none"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
										<path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
									</svg>
									<span className="sr-only">Regenerate</span>
								</button>
							</div>
						</div>
					</section>
				)}
				<Footer />
			</main>
		</div>
	);
}
