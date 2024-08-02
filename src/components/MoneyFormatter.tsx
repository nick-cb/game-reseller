import { currencyFormatter } from '@/utils';

type MoneyFormatterProps = {
  amount: number;
};
export function MoneyFormatter(props: MoneyFormatterProps) {
  const { amount } = props;
  return <>{amount > 0 ? currencyFormatter(amount) : 'Free'}</>;
}
