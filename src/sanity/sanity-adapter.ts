import { getAccountByProviderAccountId } from "@/data/account";
import {
  getUserByEmail,
  getUserById,
  getUserByIdWithAccounts,
} from "@/data/user";
import { getVerificationTokenByIdentifierAndToken } from "@/data/verification-token";
import { SHOW_QUERY_LOGS } from "@/lib/constants";
import { UserRole } from "@/types/user-role";
import type { Adapter } from "@auth/core/adapters";
import type { SanityClient } from "@sanity/client";
import { uuid } from "@sanity/uuid";

/**
 * 1. Sanity Adapter for Authjs
 * https://authjs.dev/reference/core/adapters
 * https://authjs.dev/guides/creating-a-database-adapter
 *
 * 2. Authjs AdapterUser expects id, email, emailVerified,
 * so when we fetch user from Sanity, we need to map the fields.
 *
 * 3. Define datetime for emailVerified in schema
 * turns out to be a string in type definition,
 * so we need to convert it to Date
 */
export function SanityAdapter(
  sanityClient: SanityClient,
  options = {
    schemas: {
      user: "user",
      account: "account",
      verificationToken: "verificationToken",
    },
  },
): Adapter {
  return {
    /**
     * https://authjs.dev/guides/creating-a-database-adapter#methods-and-models
     */
    async createUser(user) {
      try {
        // @sanity-typegen-ignore
        // const existingUserQry = `*[_type == "user" && email == "${user.email}"][0]`;
        // const existingUser = await sanityClient.fetch(existingUserQry);
        // if (existingUser) return existingUser;

        const existingUser = await getUserByEmail(user.email);
        if (existingUser) {
          return {
            ...existingUser,
            // Authjs AdapterUser expects id, email, emailVerified
            // and defin datetime for emailVerified in schema turns out to be a string in type definition
            id: existingUser._id,
            email: existingUser.email,
            emailVerified: existingUser.emailVerified
              ? new Date(existingUser.emailVerified)
              : null,
          };
        }

        const createdUser = await sanityClient.create({
          _type: options.schemas.user,
          _id: `user.${uuid()}`,
          role: UserRole.USER,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
        });
        if (SHOW_QUERY_LOGS) {
          console.log("createUser, user:", user);
        }

        return {
          ...createdUser,
          id: createdUser._id,
        };
      } catch (error) {
        console.error("createUser, error create user", error);
        throw new Error("createUser, error create user");
      }
    },

    async getUser(id) {
      try {
        // @sanity-typegen-ignore
        // const userQry = `*[_type == "user" && _id== "${id}"][0]`;
        // const user = await sanityClient.fetch(userQry);
        // return user;

        const user = await getUserById(id);
        if (user) {
          return {
            ...user,
            id: user._id,
            email: user.email,
            emailVerified: user.emailVerified
              ? new Date(user.emailVerified)
              : null,
          };
        }
      } catch (error) {
        console.error("getUser, error get user", error);
        throw new Error("getUser, error get user");
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      try {
        // @sanity-typegen-ignore
        // const accountQry = `*[_type == "account" && provider == "${provider}" && providerAccountId == "${providerAccountId}"][0]`;
        // const account = await sanityClient.fetch(accountQry);
        // if (!account) {
        //   console.log('getUserByAccount, no account');
        //   return;
        // }

        const account = await getAccountByProviderAccountId(
          providerAccountId,
          provider,
        );
        if (!account) {
          console.log("getUserByAccount, no account");
          return;
        }

        // @sanity-typegen-ignore
        // const userQry = `*[_type == "user" && _id== "${account.userId}"][0]`;
        // const user = await sanityClient.fetch(userQry);
        const user = await getUserById(account.userId);
        if (SHOW_QUERY_LOGS) {
          console.log("getUserByAccount, user:", user);
        }

        return {
          ...user,
          role: user.role,
          id: user._id,
          email: user.email,
          emailVerified: user.emailVerified
            ? new Date(user.emailVerified)
            : null,
        };
      } catch (error) {
        console.error("getUserByAccount, error get user by account", error);
        throw new Error("getUserByAccount, error get user by account");
      }
    },

    async updateUser(updatedUser) {
      try {
        // @sanity-typegen-ignore
        // const existingUserQry = `*[_type == "user" && _id == "${updatedUser?.id}"][0]`;
        // const existingUser = await sanityClient.fetch(existingUserQry);

        const existingUser = await getUserById(updatedUser.id);
        if (!existingUser) {
          throw new Error(
            `Could not update user: ${updatedUser.id}; unable to find user`,
          );
        }

        const patchedUser = await sanityClient
          .patch(existingUser._id)
          .set({
            ...existingUser,
            emailVerified:
              updatedUser.emailVerified === null
                ? undefined
                : updatedUser.emailVerified,
          })
          .commit();
        if (SHOW_QUERY_LOGS) {
          console.log("updateUser, user:", patchedUser);
        }

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        return patchedUser as any;
      } catch (error) {
        console.error("updateUser, error update user", error);
        throw new Error("updateUser, error update user");
      }
    },

    async deleteUser(userId) {
      try {
        return await sanityClient.delete(userId);
      } catch (error) {
        console.error("deleteUser, error delete user", error);
        throw new Error("deleteUser, error delete user");
      }
    },

    async linkAccount(account) {
      try {
        if (SHOW_QUERY_LOGS) {
          console.log("linkAccount, accountId:", account.userId);
        }
        const createdAccount = await sanityClient.create({
          _type: options.schemas.account,
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refreshToken: account.refresh_token,
          accessToken: account.access_token,
          expiresAt: account.expires_at,
          tokenType: account.token_type,
          scope: account.scope,
          idToken: account.id_token,
          user: {
            _type: "reference",
            _ref: account.userId,
          },
        });

        const userToUpdate = await sanityClient.getDocument(account.userId);
        if (SHOW_QUERY_LOGS) {
          console.log("linkAccount, user:", userToUpdate);
        }

        const updatedUserAccounts = {
          _type: "reference",
          _key: `account.${uuid()}`,
          _ref: createdAccount._id,
        };

        // https://github.com/javayhu/Authy/blob/main/adapters/sanity-adapter.ts#L140
        // in this app, accounts is a references to account schema, not an array
        await sanityClient
          .patch(userToUpdate._id)
          .set({
            emailVerified: new Date().toISOString(),
            accounts: updatedUserAccounts,
          })
          .commit();

        return account;
      } catch (error) {
        console.error("linkAccount, error link account", error);
        throw new Error("linkAccount, error link account");
      }
    },

    async unlinkAccount({ providerAccountId, provider }) {
      try {
        // @sanity-typegen-ignore
        // const accountQry = `*[_type == "account" && provider == "${provider}" && providerAccountId == "${providerAccountId}"][0]`;
        // const account = await sanityClient.fetch(accountQry);
        const account = await getAccountByProviderAccountId(
          providerAccountId,
          provider,
        );
        if (!account) {
          console.log("unlinkAccount, no account");
          return;
        }

        // const accountUser = await sanityClient.getDocument<User>(account.userId);
        const accountUser = await getUserByIdWithAccounts(account.userId);
        if (SHOW_QUERY_LOGS) {
          console.log("unlinkAccount, user:", accountUser);
        }

        // https://github.com/javayhu/Authy/blob/main/adapters/sanity-adapter.ts#L169
        // accounts is a reference to account schema, not an array
        await sanityClient
          .patch(accountUser._id)
          .set({
            accounts: null,
          })
          .commit();

        await sanityClient.delete(account._id);
      } catch (error) {
        console.error("unlinkAccount, error unlink account", error);
        throw new Error("unlinkAccount, error unlink account");
      }
    },

    /**
     * https://authjs.dev/guides/creating-a-database-adapter#verification-tokens
     */
    async getUserByEmail(email) {
      try {
        // @sanity-typegen-ignore
        // const userQry = `*[_type == "user" && email== "${email}"][0]`;
        // const user = await sanityClient.fetch(userQry);
        // return user;

        const user = await getUserByEmail(email);
        if (user) {
          return {
            ...user,
            id: user._id,
            email: user.email,
            emailVerified: user.emailVerified
              ? new Date(user.emailVerified)
              : null,
          };
        }
      } catch (error) {
        console.error("getUserByEmail, error get user by email", error);
        throw new Error("getUserByEmail, error get user by email");
      }
    },

    async createVerificationToken({ identifier, expires, token }) {
      try {
        const verificationToken = await sanityClient.create({
          _type: options.schemas.verificationToken,
          identifier,
          token,
          expires,
        });

        return verificationToken;
      } catch (error) {
        console.error(
          "createVerificationToken, error create verification token",
          error,
        );
        throw new Error(
          "createVerificationToken, error create verification token",
        );
      }
    },

    async useVerificationToken({ identifier, token }) {
      try {
        // @sanity-typegen-ignore
        // const verTokenQry = `*[_type == "verificationToken" && identifier == "${identifier}" && token == "${token}"][0]`;
        // const verToken = await sanityClient.fetch(verTokenQry);

        const verToken = await getVerificationTokenByIdentifierAndToken(
          identifier,
          token,
        );
        if (!verToken) {
          console.log("useVerificationToken, no verification token");
          return null;
        }

        if (SHOW_QUERY_LOGS) {
          console.log("useVerificationToken, verToken:", verToken);
        }
        await sanityClient.delete(verToken._id);

        return {
          ...verToken,
          id: verToken._id,
          expires: verToken.expires ? new Date(verToken.expires) : null,
          token: verToken.token,
          identifier: verToken.identifier,
        };
      } catch (error) {
        console.error(
          "useVerificationToken, error delete verification token",
          error,
        );
        throw new Error(
          "useVerificationToken, error delete verification token",
        );
      }
    },
  };
}
