import { useRef, useEffect } from 'react';

export function useCompare<T>(value: T) {
	const previousValue = usePrevious<T>(value);
	return previousValue !== value;
}

function usePrevious<T>(value: T) {
	const ref = useRef<T>();
	useEffect(() => {
		ref.current = value;
	});

	return ref.current;
}
