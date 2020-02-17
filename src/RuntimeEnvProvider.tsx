import React from 'react';
import { useCompare } from './useCompare';

export interface RuntimeEnv extends NodeJS.ProcessEnv {
	[key: string]: any;
}

interface RuntimeEnvProviderProps {
	children?: React.ReactNode;
	onError?: (error: Error) => void;
	defaultEnv: RuntimeEnv;
	configPath: string;
}

export const RuntimeEnvContext = React.createContext<RuntimeEnv>({});

export function RuntimeEnvProvider({
	children,
	onError,
	defaultEnv,
	configPath,
}: RuntimeEnvProviderProps) {
	const [env, setEnv] = React.useState<RuntimeEnv>(defaultEnv);

	const didEnvUpdate = useCompare(env);

	React.useEffect(() => {
		if (process.env.NODE_ENV !== 'development') {
			configureRuntimeEnv<RuntimeEnv>(configPath)
				?.then(data => {
					setEnv({
						...data,
						...process.env,
					});
				})
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
