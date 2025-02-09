import Link from "next/link";

export default function FileList({files}: {
    files: {
        id: number;
        filename: string;
        path: string;
    }[]
}) {
    return (<div>
        {files.map((file) => {
            return <div key={file.id} className={'gap-y-6'}>
                <h3>
                    <a target="_blank" href={file.path}
                       className={'p-2 border-solid border-gray-500 border-2 rounded-lg'}>{file.filename}</a>
                </h3>
            </div>;
        })}
    </div>);
}