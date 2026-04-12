import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types/auth';

interface UserInfoProps {
    user: User;
    showEmail?: boolean;
    className?: string;
}

export function UserInfo({ user, showEmail = false, className = '' }: UserInfoProps) {
    const getInitials = useInitials();
    
    // Safely get display name with fallbacks
    const displayName = user?.name || 'User';
    const email = user?.email || '';

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={displayName} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(displayName)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight rtl:text-right">
                <span className="truncate font-medium">{displayName}</span>
                {showEmail && email && (
                    <span className="truncate text-xs text-muted-foreground">
                        {email}
                    </span>
                )}
            </div>
        </div>
    );
}
