import random
from django.core.management.base import BaseCommand
from factory import Iterator
from tabitant_api.factories import *

# ダミーデータを作成
class Command(BaseCommand):
    help = 'Create dummy data'

    def handle(self, *args, **kwargs):
        # Create Users and their Profiles
        users = UserFactory.create_batch(20)
        self.stdout.write('Created users.')
        
        for user in users:
            setUserProfile(user)
        self.stdout.write('Updated user profiles.')

        # Create Prefectures
        prefectures = PrefectureFactory.create_batch(50)
        self.stdout.write('Created prefectures.')

        # Create Posts
        posts = PostFactory.create_batch(100, user=Iterator(users), prefecture=Iterator(prefectures))
        self.stdout.write('Created posts.')

        # Create Tags
        tags = TagFactory.create_batch(10)
        for tag in tags:
            tag_posts = random.sample(posts, random.randint(1, 10))  # Each tag gets 1 to 10 random posts
            tag.post.set(tag_posts)
        self.stdout.write('Created tags.')

        # Create Goods and Bads
        user_post_pairs = [(user, post) for user in users for post in posts]
        random.shuffle(user_post_pairs)
        good_pairs = user_post_pairs[:300]
        bad_pairs = user_post_pairs[300:600]

        goods = [GoodFactory(user=user, post=post) for user, post in good_pairs]
        bads = [BadFactory(user=user, post=post) for user, post in bad_pairs]
        self.stdout.write('Created goods and bads.')

        # Create Comments
        comments = CommentFactory.create_batch(100, user=Iterator(users), post=Iterator(posts))
        self.stdout.write('Created comments.')

        # Create GoodComments
        user_comment_pairs = [(user, comment) for user in users for comment in comments]
        random.shuffle(user_comment_pairs)
        good_comment_pairs = user_comment_pairs[:500]

        good_comments = [GoodCommentFactory(user=user, comment=comment) for user, comment in good_comment_pairs]
        self.stdout.write('Created good comments.')

        # Create Follows
        user_pairs = [(user1, user2) for user1 in users for user2 in users if user1 != user2]
        random.shuffle(user_pairs)
        follow_pairs = user_pairs[:100]

        follows = [FollowFactory(follower=user1, followee=user2) for user1, user2 in follow_pairs]
        self.stdout.write('Created follows.')

        # Create Competitions
        competitions = CompetitionFactory.create_batch(10, prefecture=Iterator(prefectures))
        for competition in competitions:
            competition_posts = random.sample(posts, random.randint(1, 20))  # Each competition gets 1 to 20 random posts
            competition.post.set(competition_posts)
        self.stdout.write('Created competitions.')

        # Create Awards
        awards = AwardFactory.create_batch(50, user=Iterator(users), post=Iterator(posts), compe=Iterator(competitions))
        self.stdout.write('Created awards.')
