import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect } from 'react';
// import { AuthProvider } from '@/contexts/AuthContext';
import 'react-native-reanimated';
import '@/assets/styles/global.css';
import { ActivityIndicator, useColorScheme } from 'react-native';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import migrations from '@/drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});
const DATABASE_NAME = 'app.db';

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});
	const expoDb = openDatabaseSync(DATABASE_NAME);
	const db = drizzle(expoDb);
	const { success, error } = useMigrations(db, migrations);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<Suspense fallback={<ActivityIndicator size={'small'} />}>
			<SQLiteProvider
				databaseName={DATABASE_NAME}
				options={{ enableChangeListener: true }}
				useSuspense
			>
				<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
					<Stack initialRouteName="index">
						<Stack.Screen name="index" options={{ headerShown: false }} />
						<Stack.Screen name="+not-found" />
					</Stack>
					<StatusBar style="auto" />
				</ThemeProvider>
			</SQLiteProvider>


		</Suspense>
	);
}