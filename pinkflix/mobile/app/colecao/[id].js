import { useLocalSearchParams } from 'expo-router';
import FormItem from '../../components/FormItem';

export default function EditarItem() {
  const { id } = useLocalSearchParams();
  return <FormItem id={id} />;
}
