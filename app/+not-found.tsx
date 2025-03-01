import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { Button } from 'react-native';
import { router } from 'expo-router';

const NotFoundScreen = () => {

	return (
		<ThemedView className="items-center justify-center flex-1 px-6">
			<ThemedText className="mb-4 text-4xl">🔍</ThemedText>
			<ThemedText className="mb-2 text-xl font-bold">Página não encontrada</ThemedText>
			<ThemedText className="mb-6 text-center text-gray-500">
				Oops! Parece que essa tela não existe ou foi removida.
			</ThemedText>
			<Button title="Voltar para o início" onPress={() => router.replace('/')} />
		</ThemedView>
	);
};

export default NotFoundScreen;
