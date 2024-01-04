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
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AUDITECHME</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>

<body class="bg-white">
    <!-- Navigation -->
    <nav class="mx-auto py-8 px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div class="w-full flex items-center justify-between border-b border-gray-200 lg:border-none">
            <div class="flex items-center">
                <a href="#">
                    <span class="sr-only">AUDITECHME</span>
                    <img class="h-8 w-auto sm:h-10" src="https://placehold.co/200x50/red/transparent.png" alt="AUDITECHME Logo">
                </a>
            </div>
            <div class="ml-10 space-x-4">
                <a href="#" class="text-base font-medium text-gray-500 hover:text-gray-900">Home</a>
                <a href="#" class="text-base font-medium text-gray-500 hover:text-gray-900">Servizi</a>
                <a href="#" class="text-base font-medium text-gray-500 hover:text-gray-900">Catalogo</a>
                <a href="#" class="text-base font-medium text-gray-500 hover:text-gray-900">Contattaci</a>
                <a href="#" class="inline-block bg-red-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75">
                    <i class="fas fa-lock"></i> AREA RISERVATA
                </a>
            </div>
        </div>
    </nav>
    
    <!-- Hero Section -->
    <div class="relative bg-white overflow-hidden">
        <div class="max-w-7xl mx-auto">
            <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                    <div class="sm:text-center lg:text-left">
                        <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                            <span class="block xl:inline">Molto più di un</span>
                            <span class="block text-red-600 xl:inline">AUDIT!</span>
                        </h1>
                        <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                            Se cerchi un servizio innovativo di osservazione e analisi indipendente, oggettiva, documentata, che ti supporti nei processi decisionali e incrementi la consapevolezza del tuo gruppo di lavoro, AUDITECHME è la risposta per te!
                        </p>
                        <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                            <div class="rounded-md shadow">
                                <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10">
                                    <i class="fas fa-euro-sign"></i> ACQUISTA
                                </a>
                            </div>
                            <div class="mt-3 sm:mt-0 sm:ml-3">
                                <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 md:py-4 md:text-lg md:px-10">
                                    <i class="fas fa-envelope"></i> CONTATTA
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://placehold.co/800x600/e2e8f0/ffffff?text=A+person+surrounded+by+documents+and+graphs" alt="A person surrounded by documents and graphs, representing analytics and data interpretation.">
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
			throw new Error('Error when generating the code');
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
				alert(`Code copied to clipboard`);
			})
			.catch((err) => {
				console.error('Error copying code', err);
			});
	};

	return (
		<div className="from-primary-200 grid grid-cols-[350px_1fr] bg-gradient-to-t via-neutral-50 to-slate-300 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700">
			<Aside imagePreviewSource={imagePreviewSource} />
			<main className="dark:bg-primary-950 mx-auto flex min-h-screen w-full max-w-7xl flex-col  p-8">
				<h1 className="text-primary-900 my-12 text-center text-5xl font-extrabold uppercase">
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
							<img src="/assets/mr-incredible.webp" className="aspect-square object-cover" alt='mr incredible' />
						</div>
						<Button onClick={() => setStep(STEPS.INITIAL)}>Home</Button>
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
