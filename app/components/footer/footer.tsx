export default function Footer() {
  return (
    <footer className="p-8">
      <p className="text-center max-w-lg mx-auto text-xs">
        created by{" "}
        <a href="https://leonardom.dev" target="_blank" rel="noopener noreferrer" className="font-bold">
          Leonardo Mogollón
        </a> using prompts <a href="https://github.com/abi/screenshot-to-code" target="_blank" rel="noopener noreferrer" className="font-bold whitespace-nowrap">
          screenshot-to-code
        </a> and using the OpenAI API to enhance user experience and provide intelligent features
      </p>
    </footer>
  );
}
