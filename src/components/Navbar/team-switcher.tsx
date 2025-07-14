import Logo from '@/assets/logos/logo.svg';

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    plan: string;
  };
}) {
  return (
    <div className="flex flex-row gap-3 items-center p-4 justify-center">
      <div>
        <img src={Logo} alt="team logo" className="w-12 h-auto" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold text-4xl">{teams.name}</span>
        <span className="truncate text-xs">{teams.plan}</span>
      </div>
    </div>
  );
}
