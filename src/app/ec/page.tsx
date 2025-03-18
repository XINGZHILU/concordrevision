import Script from "next/script";

export default function Page() {

    return (
        <div className="content-center">
            <div className="container">
                <div className="editor-container">
                    <textarea id="editor"></textarea>
                </div>
                <div className="preview-container">
                    <div id="preview"></div>
                </div>
            </div>

            <Script src=
                        "https://cdnjs.cloudflare.com/ajax/libs/marked/2.0.2/marked.min.js"></Script>
            <Script src="script.js"></Script>
        </div>
    );
}
