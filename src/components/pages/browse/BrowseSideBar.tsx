import { AccordionGroup, Accordion, AccordionHeader, AccordionBody } from '@/components/Accordion';
import BrowseSearch from '@/components/BrowseSearch';
import { CategoryCheckbox } from '@/components/CategoryCheckbox';
import { CollectionRadio } from '@/components/CollectionRadio';
import FilterContextProvider from '@/components/FilterContext';
import { RadioGroup } from '@/components/Radio';
import Filter from './Filter';
import CollectionActions from '@/actions/collections-actions';
import TagsActions from '@/actions/tags-actions';
import { Collections, Tags } from '@/database/models/model';
import { Icon } from '@/components/Icon';

export async function BrowseCarousel() {
  const [{ data: tags }, { data: collections }] = await Promise.all([
    TagsActions.tags.getTagListByGroupName({ groupName: 'genre' }),
    CollectionActions.collections.getAllCollections(),
  ]);

  return (
    <FilterContextProvider>
      <div className="fixed bottom-0 left-0 right-0 z-50 block bg-default p-2 md:hidden">
        <Filter tags={tags || []} />
      </div>
      {/* TODO: Using action to search */}
      <form className="col-start-4 col-end-5 hidden md:block">
        <noscript>
          <button
            className="mb-4 w-full rounded bg-primary
            py-2 text-white shadow-md shadow-white/10 transition-[filter] hover:brightness-105"
          >
            Submit filter
          </button>
        </noscript>
        <BrowseSearch />
        <hr className="my-4 border-white/20" />
        <AccordionGroup>
          <CategoryAccordition collections={collections} />
          <hr className="my-4 border-white_primary/20" />
          <TagsAccordion tags={tags} />
        </AccordionGroup>
      </form>
    </FilterContextProvider>
  );
}

type CategoryAccorditionProps = {
  collections: Collections[];
};
function CategoryAccordition(props: CategoryAccorditionProps) {
  const { collections } = props;
  return (
    <Accordion index={0}>
      <AccordionHeader className="flex w-[calc(100%+16px)] -translate-x-2 items-center justify-between rounded px-2 py-4 outline outline-0 outline-white focus:outline-1">
        <div>Collections</div>
        <Icon name="arrow-down-s" variant="line" fill="white" />
      </AccordionHeader>
      <AccordionBody className="mt-1">
        <RadioGroup toggleAble>
          <ul className="flex flex-col gap-1">
            {collections.map((collection) => {
              if (!collection) {
                return null;
              }
              return (
                <li key={collection.ID} className="relative flex rounded text-sm text-white/60">
                  <div className="absolute inset-0 bg-default"></div>
                  <CollectionRadio
                    tabIndex={0}
                    collection={collection}
                    className="peer h-9 w-full"
                  />
                  <label
                    htmlFor={collection.collection_key}
                    className="absolute inset-0 flex h-9 cursor-pointer
                  items-center rounded bg-default
                  px-2 text-white/60 transition-colors hover:text-white_primary peer-checked:bg-white/[.15]"
                  >
                    {collection.name[0].toUpperCase() + collection.name.substring(1)}
                  </label>
                </li>
              );
            })}
          </ul>
        </RadioGroup>
      </AccordionBody>
    </Accordion>
  );
}

type TagsAccordionProps = {
  tags: Tags[];
};
async function TagsAccordion(props: TagsAccordionProps) {
  const { tags } = props;
  return (
    <Accordion index={1}>
      <AccordionHeader className="flex w-[calc(100%+16px)] -translate-x-2 items-center justify-between rounded px-2 py-4 outline outline-0 outline-white focus:outline-1">
        <span>Tags</span>
        <Icon name="arrow-down-s" variant="line" fill="white" />
      </AccordionHeader>
      <AccordionBody className="mt-1">
        <ul className="flex flex-col gap-1">
          {tags.map((tag) => (
            <li
              key={tag.ID}
              className="relative flex
                rounded text-sm text-white/60"
            >
              <div className="absolute inset-0 bg-default"></div>
              <CategoryCheckbox tag={tag} id={tag.tag_key.toString()} className="peer h-9 w-full" />
              <label
                htmlFor={tag.tag_key}
                className={
                  'absolute inset-0 h-9 rounded px-2 ' +
                  'flex cursor-pointer items-center ' +
                  'bg-default text-white/60 transition-colors hover:text-white_primary ' +
                  ' peer-checked:bg-white/[.15] peer-checked:text-white_primary ' +
                  ' peer-focus:text-white_primary '
                }
              >
                {tag.name[0].toUpperCase() + tag.name.substring(1)}
              </label>
            </li>
          ))}
        </ul>
      </AccordionBody>
    </Accordion>
  );
}
