import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SessaoProvider } from '../lib/sessao';
import { cores } from '../styles/tema';

export default function Layout() {
  return (
    <SessaoProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: cores.rosa },
          headerTintColor: cores.branco,
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: cores.fundo }
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="cadastro" options={{ title: 'Criar conta' }} />
        <Stack.Screen name="colecao/index" options={{ title: '💖 PinkFlix' }} />
        <Stack.Screen name="colecao/novo" options={{ title: 'Novo item ✨' }} />
        <Stack.Screen name="colecao/[id]" options={{ title: 'Editar item' }} />
        <Stack.Screen name="playlist" options={{ title: '🎵 Playlist' }} />
      </Stack>
    </SessaoProvider>
  );
}
