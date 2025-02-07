import Link from "next/link";

export default function Page() {
    return <div className={'place-items-center'}>
        <Link href={'/tools/pomodoro'}>
            Pomodoro
        </Link>
    </div>;
}