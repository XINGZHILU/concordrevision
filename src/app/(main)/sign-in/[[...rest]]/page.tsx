import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return <div className={'place-items-center w-screen'}>
        <SignIn />
    </div>
}