export default function FileList({files}: {
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
                    <a target="_blank" href={file.path}
                       className={'p-2 border-solid border-gray-500 border-2 rounded-lg'}>{file.filename}</a>
                </h3>
                <br/>

            </div>;
        })}
    </div>);
}