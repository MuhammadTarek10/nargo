# Features

1. Authentication ✅
2. Admins and Customers ✅
3. Products Management ✅
   1. CRUD ✅
   2. Filtering ✅
4. Order Placements
   1. Cart ✅
   2. History ✅
   3. Tracking ✅
   4. Email Notification ✅
   5. Payment
5. Rate Limiting ✅
6. Dockerization ✅
7. Documentation
8. Testing
   1. Unit ✅
   2. Integration ✅
9. Caching ✅
10. Hosting
11. Dashboard
12. Bulk Operation
13. Real-time

# Docs

## Architecture

- For Simplicity, I used prisma as ORM with no interface, for future enhancement, we can decouple the application logic from using prisma and interact with it as interface.

## Technical Debt

- Didn't follow SRP (Single Responsibility Principle) for some operations for fast development, intended to refactor it in the future.
- Don't put role in token, manage RBAC better.

## Database

- Making minimalistic incremental approach, not having all functionalities from the start.
- Having indexes for quantity, category_slug, price, for faster reads.
- Wanted to have no cart for simplicity, but it would require some handling in the order status, so I will stick the "cart" and "cartItem" approach.
- Followed snake_case convention of naming tables and fields

## Authorization

- Decided to choose RBAC for authorization for its simplicty and straigt forward nature.
- Because I have 2 users only, I decided to have a filed "role" in the users table to know the users role.
- Put index on the role to get whether all users or all admins at once for future analytics, like which users buys more, which admins created more products and so on.

## Error Handling

- Have thrown built-in exception for appropriate error handling.
- Added global exception filters to handle context of error and return good message to users.

## Rate Limiting

- At first, I tried to use Arcjet for security, rate limiting is a feature that it supports, it also provides more security options.
- But eventually I used throttler for it minimal configuration.

## Email Notification

- Used https://ethereal.email as SMTP host for testing.
- When updating order status, it gets the email of users and send email with the status update.

## Caching

- Used in memory caching for testing at first.
- Then integrated redis via docker.

## Challenges

- Hosting
  - was a bit of challenge, because I wanted to have database and application on docker, and there were no free plans on site that supports vps.
  - Thought to have supabase as postgres database and deploy the api only on any service, but didn't want to have another integration at first for just that.
- Caching
  - Followed documentation for adding caching and redis store to nestjs, I noticed there are obsolete packages in the tutorials.
  - Had some trouble for configuring it with docker, but cracked it at the end.
- Rate Limiting
  - Had problems with Arcjet, I found it on some article, it has a lot to give for security, but for just rate limiting I used throttle.
