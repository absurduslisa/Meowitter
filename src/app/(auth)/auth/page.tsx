import AuthTabs from '@/components/auth/AuthTabs';
import { pageLayout } from '@/styles/global';

export default function LoginPage() {
    return (
        <main className={`${pageLayout.mainCenter}`}>
            <AuthTabs />
        </main>
    );
}
