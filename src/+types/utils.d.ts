type PageProps = {
  params: { [K in string]: string | string[] | undefined };
  searchParams: { [K in string]: string | string[] | undefined };
};

type RootLayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
}
