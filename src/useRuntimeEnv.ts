import { useContext } from 'react';
import { RuntimeEnvContext } from './RuntimeEnvProvider';

export function useRuntimeEnv() {
	const context = useContext(RuntimeEnvContext);

	if (context === undefined) {
		throw new Error('useRuntimeEnv must be used within a RuntimeEnvProvider');
	}

	return context;
}
