import Link from "next/link";

export default function FileList({ files }: {
    files: {
        id: number;
        filename: string;
        path: string;
    }[]
}) {
    return (<div className={'gap-y-6'}>
        {files.map((file) => {
            return <div key={file.id}>
                <h3>
                    <Link href={`/fileview/pdf/${file.id}`}
                        className={'p-2 border-solid border-gray-500 border-2 rounded-lg'}>
                            {file.filename}</Link>
                </h3>
                <br />

            </div>;
        })}
    </div>);
}