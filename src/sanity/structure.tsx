import {
  BillIcon,
  CheckmarkCircleIcon,
  ClockIcon,
  CloseCircleIcon,
  CogIcon,
  ComponentIcon,
  DashboardIcon,
  DiamondIcon,
  DocumentTextIcon,
  DocumentsIcon,
  MasterDetailIcon,
  ProjectsIcon,
  StarFilledIcon,
  TagsIcon,
  TaskIcon,
  TiersIcon,
  TokenIcon,
  UserIcon,
  UsersIcon,
} from "@sanity/icons";
import type { DocumentDefinition } from "sanity";
import type { StructureResolver } from "sanity/structure";
import { schemaTypes } from "./schemas";
import account from "./schemas/documents/auth/account";
import passwordResetToken from "./schemas/documents/auth/password-reset-token";
import user from "./schemas/documents/auth/user";
import verificationToken from "./schemas/documents/auth/verification-token";
import blogCategory from "./schemas/documents/blog/blog-category";
import blogPost from "./schemas/documents/blog/blog-post";
import category from "./schemas/documents/directory/category";
import item from "./schemas/documents/directory/item";
import tag from "./schemas/documents/directory/tag";
import order from "./schemas/documents/order/order";
import page from "./schemas/documents/page/page";
import settings from "./schemas/documents/settings";

const singletonTypes: DocumentDefinition[] = [settings];

// The StructureResolver is how we're changing the DeskTool structure to linking to document (named Singleton)
// demo: https://github.com/javayhu/sanity-press/blob/main/sanity/src/structure.ts#L7
export const structure = (
  /* typeDefArray: DocumentDefinition[] */
): StructureResolver => {
  return (S) => {
    // Goes through all of the singletons and translates them into something the Structure tool can understand
    const singletonItems = singletonTypes.map((singletonType) => {
      return S.listItem()
        .title(singletonType.title ?? "")
        .icon(CogIcon)
        .child(
          S.editor()
            .id(singletonType.name)
            .schemaType(singletonType.name)
            .documentId(singletonType.name),
        );
    });

    // other list items (like MediaTag)
    const otherListItems = S.documentTypeListItems().filter(
      (listItem) => !schemaTypes.find((type) => type.name === listItem.getId()),
    );

    // helper function
    const createFilteredListItem = (
      title: string,
      schemaType: string,
      icon: React.ComponentType<{ className?: string }>,
      filter: string,
    ) => {
      return S.listItem()
        .title(title)
        .schemaType(schemaType)
        .icon(icon)
        .child(
          S.documentList().schemaType(schemaType).title(title).filter(filter),
        );
    };

    // submissions in free plan
    const pendingSubmissionsInFreePlan = createFilteredListItem(
      "Pending Submissions In Free Plan",
      item.name,
      ClockIcon,
      '_type == "item" && pricePlan == "free" && freePlanStatus == "pending"',
    );

    const rejectedSubmissionsInFreePlan = createFilteredListItem(
      "Rejected Submissions In Free Plan",
      item.name,
      CloseCircleIcon,
      '_type == "item" && pricePlan == "free" && freePlanStatus == "rejected"',
    );

    const approvedSubmissionsInFreePlan = createFilteredListItem(
      "Approved Submissions In Free Plan",
      item.name,
      CheckmarkCircleIcon,
      '_type == "item" && pricePlan == "free" && freePlanStatus == "approved"',
    );

    const itemsInFreePlan = createFilteredListItem(
      "All Items In Free Plan",
      item.name,
      ProjectsIcon,
      '_type == "item" && pricePlan == "free"',
    );

    const freePlanItemManagement = S.listItem()
      .title("Free Plan Item management")
      .icon(ProjectsIcon)
      .child(
        S.list()
          .title("Item management")
          .items([
            pendingSubmissionsInFreePlan,
            rejectedSubmissionsInFreePlan,
            approvedSubmissionsInFreePlan,
            itemsInFreePlan,
          ]),
      );

    // submissions in pro plan
    const pendingSubmissionsInProPlan = createFilteredListItem(
      "Pending Submissions In Pro Plan",
      item.name,
      ClockIcon,
      '_type == "item" && pricePlan == "pro" && proPlanStatus == "pending"',
    );

    const failedSubmissionsInProPlan = createFilteredListItem(
      "Failed Submissions In Pro Plan",
      item.name,
      CloseCircleIcon,
      '_type == "item" && pricePlan == "pro" && proPlanStatus == "failed"',
    );

    const successSubmissionsInProPlan = createFilteredListItem(
      "Success Submissions In Pro Plan",
      item.name,
      CheckmarkCircleIcon,
      '_type == "item" && pricePlan == "pro" && proPlanStatus == "success"',
    );

    const itemsInProPlan = createFilteredListItem(
      "All Items In Pro Plan",
      item.name,
      DiamondIcon,
      '_type == "item" && pricePlan == "pro"',
    );

    const proPlanItemManagement = S.listItem()
      .title("Pro Plan Item management")
      .icon(DiamondIcon)
      .child(
        S.list()
          .title("Item management")
          .items([
            pendingSubmissionsInProPlan,
            failedSubmissionsInProPlan,
            successSubmissionsInProPlan,
            itemsInProPlan,
          ]),
      );

    // featured items
    const featuredItems = createFilteredListItem(
      "Featured Items",
      item.name,
      StarFilledIcon,
      '_type == "item" && featured == true',
    );

    // published items
    const publishedItems = createFilteredListItem(
      "Published Items",
      item.name,
      TaskIcon,
      '_type == "item" && publishDate != null',
    );

    const unpublishedItems = createFilteredListItem(
      "Unpublished Items",
      item.name,
      ClockIcon,
      '_type == "item" && publishDate == null',
    );

    const allItems = S.documentTypeListItem(item.name)
      .title("All Items")
      .icon(DashboardIcon);

    const itemsBySubmitter = S.listItem()
      .title("Items By Submitter")
      .icon(MasterDetailIcon)
      .child(
        S.documentTypeList(user.name)
          .title("Items by Submitter")
          .child((userId) =>
            S.documentList()
              .title("Items")
              .filter('_type == "item" && submitter._ref == $userId')
              .params({ userId }),
          ),
      );

    // failed orders
    const failedOrders = createFilteredListItem(
      "Failed Orders",
      order.name,
      CloseCircleIcon,
      '_type == "order" && status == "failed"',
    );

    // success orders
    const successOrders = createFilteredListItem(
      "Success Orders",
      order.name,
      CheckmarkCircleIcon,
      '_type == "order" && status == "success"',
    );

    // all orders
    const allOrders = S.documentTypeListItem(order.name)
      .title("All Orders")
      .icon(BillIcon);

    // categories
    const allCategories = S.documentTypeListItem(category.name)
      .title("All Categories")
      .icon(TiersIcon);

    const itemsByCategory = S.listItem()
      .title("Items By Category")
      .icon(MasterDetailIcon)
      .child(
        S.documentTypeList(category.name)
          .title("Items by Category")
          .child((categoryId) =>
            S.documentList()
              .title("Posts")
              .filter('_type == "item" && $categoryId in categories[]._ref')
              .params({ categoryId }),
          ),
      );

    // tags
    const allTags = S.documentTypeListItem(tag.name)
      .title("All Tags")
      .icon(TagsIcon);

    const itemsByTag = S.listItem()
      .title("Items By Tag")
      .icon(MasterDetailIcon)
      .child(
        S.documentTypeList(tag.name)
          .title("Items by Tag")
          .child((tagId) =>
            S.documentList()
              .title("Posts")
              .filter('_type == "item" && $tagId in tags[]._ref')
              .params({ tagId }),
          ),
      );

    // blog categories
    const allBlogCategories = S.documentTypeListItem(blogCategory.name)
      .title("All Blog Categories")
      .icon(ComponentIcon);

    const postsByCategory = S.listItem()
      .title("Posts By Category")
      .icon(MasterDetailIcon)
      .child(
        S.documentTypeList(blogCategory.name)
          .title("Posts by Category")
          .child((categoryId) =>
            S.documentList()
              .title("Posts")
              .filter('_type == "blogPost" && $categoryId in categories[]._ref')
              .params({ categoryId }),
          ),
      );

    return S.list()
      .title("Content")
      .items([
        // pendingSubmissionsInFreePlan,
        // S.divider(),

        // S.documentTypeListItem(item.name)
        //   .icon(DashboardIcon),
        // group the item management

        S.listItem()
          .title("Item management")
          .icon(DashboardIcon)
          .child(
            S.list().title("Item management").items([
              allItems,
              freePlanItemManagement,
              proPlanItemManagement,
              S.divider(),

              featuredItems,
              publishedItems,
              unpublishedItems,

              S.divider(),
              itemsBySubmitter,
              itemsByCategory,
              itemsByTag,
            ]),
          ),

        S.divider(),

        // S.documentTypeListItem(category.name)
        //   .icon(TiersIcon),
        S.listItem()
          .title("Category management")
          .icon(TiersIcon)
          .child(
            S.list()
              .title("Category management")
              .items([allCategories, itemsByCategory]),
          ),

        // S.documentTypeListItem(tag.name)
        //   .icon(TagsIcon),
        S.listItem()
          .title("Tag management")
          .icon(TagsIcon)
          .child(S.list().title("Tag management").items([allTags, itemsByTag])),

        S.divider(),

        S.documentTypeListItem(blogPost.name).icon(DocumentsIcon),
        // S.documentTypeListItem(blogCategory.name)
        //   .icon(TiersIcon),

        S.listItem()
          .title("Blog Category management")
          .icon(ComponentIcon)
          .child(
            S.list()
              .title("Blog Category management")
              .items([allBlogCategories, postsByCategory]),
          ),

        S.divider(),

        // group the order management
        // S.documentTypeListItem(order.name)
        //   .icon(BillIcon),
        S.listItem()
          .title("Order management")
          .icon(BillIcon)
          .child(
            S.list()
              .title("Order management")
              .items([successOrders, failedOrders, S.divider(), allOrders]),
          ),

        S.divider(),

        // group the user management
        S.listItem()
          .title("User management")
          .icon(UsersIcon)
          .child(
            S.list()
              .title("User management")
              .items([
                S.documentTypeListItem(user.name).icon(UserIcon),
                S.documentTypeListItem(account.name).icon(UsersIcon),
                S.documentTypeListItem(verificationToken.name).icon(TokenIcon),
                S.documentTypeListItem(passwordResetToken.name).icon(TokenIcon),
              ]),
          ),

        S.divider(),

        S.documentTypeListItem(page.name).icon(DocumentTextIcon),

        S.divider(),

        ...singletonItems,

        S.divider(),

        ...otherListItems,
      ]);
  };
};
