import csv
import os
import random
from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils import timezone
from faker import Factory as FakerFactory
from factory import Iterator
from tabitant_api.factories import *
import ml

def get_emotion_labels(contents: list):
    content = "".join(contents)
    d = ml.eval(content)
    emotions = {
        'emotion_ureshii': d["emotion.happy"] + 1,
        'emotion_omoshiroi': d["emotion.funny"] + 1,
        'emotion_odayaka': d["emotion.calm"] + 1,
        'emotion_shimijimi': d["emotion.sad"] + 1,
        'emotion_samishii': d["emotion.lonely"] + 1,
        'emotion_ikari': d["emotion.angry"] + 1,
    }
    return emotions

# ダミーデータを作成
class Command(BaseCommand):
    help = 'Create dummy data'

    def handle(self, *args, **kwargs):
        faker = FakerFactory.create('ja_JP')
        ml.load()

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
        prefecture_dict = { pref.name: pref for pref in prefectures }
        with open(os.path.join(settings.BASE_DIR, "tabitant_api", "static", "tabitant_api", "cities.csv")) as f:
            reader = csv.DictReader(f)
            cities = list(reader)
        random.shuffle(cities)
        with open(os.path.join(settings.BASE_DIR, "tabitant_api", "static", "tabitant_api", "tanka.csv")) as f:
            reader = csv.reader(f)
            contents = list(reader)
        random.shuffle(contents)
        posts = []
        for i in range(100):
            posts.append(PostFactory(user=users[i % len(users)], latitude=float(cities[i]['latitude']),
                                     longitude=float(cities[i]['longitude']), prefecture=prefecture_dict[cities[i]['prefecture']],
                                     detailed_place=cities[i]['city'],
                                     **{f'content_{j + 1}': contents[i][j] for j in range(5)},
                                     **get_emotion_labels(contents[i])))
        LAT_CENTER = 35.026244
        LNG_CENTER = 135.780822
        RANGE = 0.05
        for i in range(100):
            posts.append(PostFactory(user=users[len(posts) % len(users)],
                                     latitude=LAT_CENTER + random.uniform(-RANGE, RANGE),
                                     longitude=LNG_CENTER + random.uniform(-RANGE, RANGE),
                                     prefecture=prefecture_dict["京都府"],
                                     detailed_place="京都市左京区",
                                     **{f'content_{j + 1}': contents[len(posts)][j] for j in range(5)},
                                     **get_emotion_labels(contents[len(posts)])))
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
        pref_compe = { pref.id: [] for pref in prefectures }
        for competition in competitions:
            pref_compe[competition.prefecture.id].append(competition)
        for post in posts:
            random.choice(pref_compe[post.prefecture.id]).post.add(post)
        self.stdout.write('Created competitions.')

        # Create Awards
        awards = AwardFactory.create_batch(50, user=Iterator(users), post=Iterator(posts), compe=Iterator(competitions))
        self.stdout.write('Created awards.')
