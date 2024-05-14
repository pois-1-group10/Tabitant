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
        for user in users:
            UserProfileFactory(user=user)
        self.stdout.write('Created users and their profiles.')

        # Create Prefectures
        prefectures = PrefectureFactory.create_batch(50)
        self.stdout.write('Created prefectures.')

        # Create Posts
        posts = PostFactory.create_batch(100, user=Iterator(users), prefecture=Iterator(prefectures))
        self.stdout.write('Created posts.')

        # Create Tags
        tags = TagFactory.create_batch(10)
        for tag in tags:
            tag_posts = random.sample(posts, random.randint(1, 5))  # Each tag gets 1 to 5 random posts
            tag.post.set(tag_posts)
        self.stdout.write('Created tags.')

        # Create Goods and Bads
        goods = GoodFactory.create_batch(100, user=Iterator(users), post=Iterator(posts))
        bads = BadFactory.create_batch(100, user=Iterator(users), post=Iterator(posts))
        self.stdout.write('Created goods and bads.')

        # Create Comments
        comments = CommentFactory.create_batch(20, user=Iterator(users), post=Iterator(posts))
        self.stdout.write('Created comments.')

        # Create GoodComments
        good_comments = GoodCommentFactory.create_batch(100, user=Iterator(users), comment=Iterator(comments))
        self.stdout.write('Created good comments.')

        # Create Follows
        follows = FollowFactory.create_batch(10, follower=Iterator(users), followee=Iterator(users))
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
