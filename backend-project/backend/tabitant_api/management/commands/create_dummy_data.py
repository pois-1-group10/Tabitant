import csv
import os
import random
from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils import timezone
from faker import Factory as FakerFactory
from factory import Iterator
from tabitant_api.factories import *

# ダミーデータを作成
class Command(BaseCommand):
    help = 'Create dummy data'

    def handle(self, *args, **kwargs):
        faker = FakerFactory.create('ja_JP')

        # Create Users and their Profiles
        usernames = set()
        while len(usernames) < 20:
            usernames.add(faker.user_name())
        users = UserFactory.create_batch(len(usernames), username=Iterator(usernames))
        self.stdout.write('Created users.')

        for user in users:
            setUserProfile(user)
        self.stdout.write('Updated user profiles.')

        # Create Prefectures
        prefectures = []
        with open(os.path.join(settings.BASE_DIR, "tabitant_api", "static", "tabitant_api", "prefectures.csv")) as f:
            reader = csv.reader(f)
            for item in reader:
                prefectures.append(PrefectureFactory(name=item[1]))
        self.stdout.write('Created prefectures.')

        # Create Posts
        lat, lng = map(list, zip(*[map(float, faker.local_latlng("JP", True)) for _ in range(100)]))
        for i in range(len(lat)):
            noise = random.uniform(0.1, 3)
            lat[i] += random.uniform(-noise, noise)
            noise = random.uniform(0.1, 3)
            lng[i] += random.uniform(-noise, noise)
        posts = PostFactory.create_batch(len(lat), user=Iterator(users), latitude=Iterator(lat), longitude=Iterator(lng),
                                         prefecture=Iterator(prefectures))
        self.stdout.write('Created posts.')

        # Create Tags
        tags = []
        with open(os.path.join(settings.BASE_DIR, "tabitant_api", "static", "tabitant_api", "tags.csv")) as f:
            reader = csv.reader(f)
            for item in reader:
                tags.append(TagFactory(name=item[1]))
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

        # Create BadComments
        random.shuffle(user_comment_pairs)
        bad_comment_pairs = user_comment_pairs[500:1000]

        bad_comments = [BadCommentFactory(user=user, comment=comment) for user, comment in bad_comment_pairs]
        self.stdout.write('Created bad comments.')

        # Create Follows
        user_pairs = [(user1, user2) for user1 in users for user2 in users if user1 != user2]
        random.shuffle(user_pairs)
        follow_pairs = user_pairs[:100]

        follows = [FollowFactory(follower=user1, followee=user2) for user1, user2 in follow_pairs]
        self.stdout.write('Created follows.')

        # Create Competitions
        now = timezone.now()
        competitions = [CompetitionFactory(year=now.year, month=month, prefecture=prefecture) \
                        for prefecture in prefectures for month in range(1, now.month + 1)]
        for competition in competitions:
            competition_posts = random.sample(posts, random.randint(1, 20))  # Each competition gets 1 to 20 random posts
            competition.post.set(competition_posts)
        self.stdout.write('Created competitions.')

        # Create Awards
        awards = AwardFactory.create_batch(50, user=Iterator(users), post=Iterator(posts), compe=Iterator(competitions))
        self.stdout.write('Created awards.')
