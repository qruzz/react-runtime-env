import React from 'react';
import { useCompare } from './useCompare';

let RuntimeEnvContext: any = undefined;

export function RuntimeEnvProvider<T extends NodeJS.ProcessEnv>({
	defaultEnv,
	configPath,
	onError,
	children,
}: {
	defaultEnv: T;
	configPath: string;
	onError?: (error: Error) => void;
	children: React.ReactNode;
}) {
	const [env, setEnv] = React.useState<T>(defaultEnv);

	RuntimeEnvContext = React.createContext<T>(defaultEnv);

	const didEnvUpdate = useCompare(env);

	React.useEffect(() => {
		if (process.env.NODE_ENV !== 'development') {
			configureRuntimeEnv<T>(configPath)
				?.then(data =>
					setEnv({
						...data,
						...process.env,
					})
				)
				.catch(error => {
					if (onError) {
						onError(error);
					} else {
						throw new Error(error);
					}
				});
		} else {
			setEnv({
				...env,
				...process.env,
			});
		}
	}, [didEnvUpdate]);

	return (
		<RuntimeEnvContext.Provider value={env}>
			{children}
		</RuntimeEnvContext.Provider>
	);
}

export function useRuntimeEnv<T>() {
	const context = React.useContext<T>(RuntimeEnvContext as React.Context<T>);

	if (context === undefined) {
		throw new Error('useRuntimeEnv must be used within a RuntimeEnvProvider');
	}

	return context;
}

function configureRuntimeEnv<T>(configPath: string): Promise<T> | null {
	if (fetch !== undefined) {
		return fetch(configPath)
			.then(response => {
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				return response.json() as Promise<T>;
			})
			.catch(error => {
				throw new Error(error);
			});
	}

	return null;
}
