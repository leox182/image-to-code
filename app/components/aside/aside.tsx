import { ChangeEvent } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { InputRadio, ToggleSwitch } from '@/components/ui';
import {
	FRAMEWORK_CSS_PARAM as frameworkUIParam,
	FRAMEWORK_UI_PARAM as frameworkCSSParam,
	VANILLA_MODE_PARAM as vanillaModeParam,
} from '@/lib/variables';

interface Props {
	imagePreviewSource: string;
}

export default function Aside({ imagePreviewSource }: Props) {
	const optionParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const isVanillaMode = optionParams.get(vanillaModeParam) === 'true';
	const uiFramework = optionParams.get(frameworkUIParam) || null;
	const cssFramework = optionParams.get(frameworkCSSParam) || null;

	const handleSwitchCodeMode = () => {
		const params = new URLSearchParams(optionParams);
		params.delete(frameworkUIParam);
		params.delete(frameworkCSSParam);
		params.set(vanillaModeParam, JSON.stringify(!isVanillaMode));
		replace(`${pathname}?${params.toString()}`);
	};

	const handleFrameworkChange = (e: ChangeEvent<HTMLInputElement>) => {
		const params = new URLSearchParams(optionParams);
		params.set(e.target.name, e.target.value);
		replace(`${pathname}?${params.toString()}`);
	};

	return (
		<aside className="bg-primary-400 flex h-screen w-full flex-col p-8">
			<div className="flex h-full flex-col">
				<div className="flex-grow">
					<h2 className="mb-4 text-2xl">Code options</h2>

					<ToggleSwitch
						label="Use only vanilla HTML/CSS"
						value="true"
						defaultChecked={isVanillaMode}
						onChange={handleSwitchCodeMode}
					/>

					{!isVanillaMode && (
						<form>
							<fieldset>
								<legend className="mb-4">UI Framework/Library</legend>
								<InputRadio
									label="Vanilla HTML"
									value="htmlVanilla"
									name={frameworkUIParam}
									defaultChecked={uiFramework === 'htmlVanilla' || uiFramework === null}
									onChange={handleFrameworkChange}
								/>
								<InputRadio
									label="React"
									value="react"
									name={frameworkUIParam}
									defaultChecked={uiFramework === 'react'}
									onChange={handleFrameworkChange}
								/>
							</fieldset>
							<fieldset>
								<legend className="mb-4">CSS Framework</legend>
								<InputRadio
									label="Tailwindcss"
									value="tailwind"
									name={frameworkCSSParam}
									defaultChecked={cssFramework === 'tailwind' || cssFramework === null}
									onChange={handleFrameworkChange}
								/>
								<InputRadio
									label="Bootstrap"
									value="bootstrap"
									name={frameworkCSSParam}
									defaultChecked={cssFramework === 'bootstrap'}
									onChange={handleFrameworkChange}
								/>
							</fieldset>
						</form>
					)}
				</div>

				<div className="overflow-hidden rounded-md">
					{imagePreviewSource && (
						<img
							className="aspect-video object-cover"
							src={imagePreviewSource}
							alt="Recent image"
						/>
					)}
				</div>
			</div>
		</aside>
	);
}
