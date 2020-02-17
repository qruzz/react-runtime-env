import React from 'react';
import { useCompare } from './useCompare';

export interface RuntimeEnvironmentProps<T> {
	defaultEnv: T;
	configPath: string;
	onError?: (error: Error) => void;
}

export interface RuntimeEnvProviderProps {
	children: React.ReactNode;
}

export function configureRuntimeEnvironment<T>({
	defaultEnv,
	configPath,
	onError,
}: RuntimeEnvironmentProps<T>) {
	const RuntimeEnvContext = React.createContext<T | undefined>(undefined);

	function RuntimeEnvProvider({ children }: RuntimeEnvProviderProps) {
		const [env, setEnv] = React.useState<T>(defaultEnv);

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

	function useRuntimeEnv() {
		const context = React.useContext(RuntimeEnvContext);

		if (context === undefined) {
			throw new Error('useRuntimeEnv must be used within a RuntimeEnvProvider');
		}

		return context;
	}

	return { RuntimeEnvProvider, useRuntimeEnv };
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
