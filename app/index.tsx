import TextInput from '../components/ui/TextInput';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/ui/Button';
import { useCallback, useEffect, useState } from 'react';
import { User } from '../database/schema';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { isCPF } from '../utils/helpers';
import { userService } from '../services/userService';


const formSchema = z.object({
	name: z.string().min(1, 'Campo obrigatório'),
	email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
	cpf: z.string()
		.min(11, 'O CPF deve ter 11 caracteres')
		.max(14, 'O CPF deve ter no máximo 14 caracteres')
		.refine(isCPF, { message: 'CPF inválido' }),
});

type InnerFormData = z.infer<typeof formSchema>;
const cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

const HomeScreen = () => {
	const { control, handleSubmit, formState: { errors } } = useForm<InnerFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: 'Eduardo Neves',
			email: 'email3@email.com',
			cpf: '036.834.200-06',
		},
	});
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);

	const getUsers = useCallback(async () => {
		const collection = await userService.getUsers({});
		setUsers(collection);
	}, []);

	const onSubmit = async (data: InnerFormData) => {
		try {
			setLoading(true);

			const user = {
				name: data.name,
				email: data.email,
				cpf: data.cpf,
			};
			await userService.addUser(user);

			getUsers();
		} catch (error: any) {
			console.error('Erro ao criar usuário', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getUsers();
	}, [getUsers]);

	return (
		<SafeAreaProvider>
			<SafeAreaView className="flex-1">
				<View className="gap-4 p-5">
					<Controller
						control={control}
						name="name"
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								autoCapitalize="characters"
								returnKeyType="next"
								placeholder="name"
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								disabled={loading}
								error={!!errors.name}
								errorMessage={errors.name?.message}
							/>
						)}
					/>

					<Controller
						control={control}
						name="email"
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								keyboardType="email-address"
								returnKeyType="next"
								placeholder="Email"
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								disabled={loading}
								error={!!errors.email}
								errorMessage={errors.email?.message}
							/>
						)}
					/>

					<Controller
						control={control}
						name="cpf"
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								returnKeyType="next"
								placeholder="CPF"
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								disabled={loading}
								error={!!errors.cpf}
								errorMessage={errors.cpf?.message}
								mask={cpfMask}
							/>
						)}
					/>

					<Button
						onPress={handleSubmit(onSubmit)}
						color="primary"
						className="w-full"
						disabled={loading}
					>
						<Text className="text-white">CADASTRAR</Text>
					</Button>
				</View>

				<FlatList
					data={users}
					keyExtractor={(item) => String(item.id)}
					contentContainerStyle={{ gap: 4, padding: 20 }}
					renderItem={({ item }) => (
						<View className="p-4 border border-white rounded">
							<Text className="text-white">{item.name}</Text>
						</View>
					)}
				/>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

export default HomeScreen;