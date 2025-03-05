import { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Text, View, RefreshControl } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ui/ThemedView';
import { HttpClient } from '@/services/HTTPClient';
import { pokeService } from '@/services/pokeService';
import { debounce } from '@/utils/debounce';
import TextInput from '@/components/ui/TextInput';

const { client } = HttpClient();
const service = pokeService(client);

const HomeScreen = () => {
	const [list, setList] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [search, setSearch] = useState<string>('');

	const fetchPokemons = async (searchTerm: string) => {
		setLoading(true);

		try {
			const response: any = await service.getAllAsync({ search: searchTerm });

			if (response.success) {
				setList(response.data);
			}
		} catch (error) {
			console.error('Error fetching pokemons:', error);
		} finally {
			setLoading(false);
		}
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedFetchPokemons = useCallback(
		debounce(async (searchTerm: string) => {
			await fetchPokemons(searchTerm);
		}, 100),
		[],
	);

	useEffect(() => {
		debouncedFetchPokemons(search);
	}, [search, debouncedFetchPokemons]);

	return (
		<SafeAreaProvider>
			<SafeAreaView className="flex-1">
				<ThemedView className="flex flex-col flex-1 gap-5 p-5">
					<TextInput
						placeholder="Pesquisar pelo nome"
						value={search}
						onChangeText={setSearch}
					/>

					<FlatList
						data={list}
						keyExtractor={item => item.number.toString()}
						numColumns={2}
						refreshing={loading}
						renderItem={({ item }) => (
							<View className="flex-1 p-2">
								<View className="flex items-center justify-end p-5 bg-gray-700 rounded-lg">
									<Image className="w-[80px] h-[80px]" source={{ uri: item.ThumbnailImage }} resizeMode="contain" />
									<Text className="w-full text-white uppercase">Nº{item.number}</Text>
									<Text className="w-full font-bold text-white uppercase">{item.name}</Text>
								</View>
							</View>
						)}
						refreshControl={
							<RefreshControl
								refreshing={loading}
								onRefresh={() => debouncedFetchPokemons('')}
								colors={['#007BFF']}
								progressBackgroundColor="#FFFFFF"
							/>
						}
					/>
				</ThemedView>
			</SafeAreaView>
		</SafeAreaProvider>

	);
};

export default HomeScreen;