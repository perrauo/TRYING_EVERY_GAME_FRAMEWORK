using Cirrus.TutorialQuest.Objects;
using Microsoft.Xna.Framework;
using MonoGame.Extended;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cirrus.TutorialQuest.Objects;

namespace Cirrus.TutorialQuest
{
    public class CameraController
    {
        private BaseObject target;

        private OrthographicCamera camera;

        public OrthographicCamera Camera => camera;

        public CameraController(OrthographicCamera camera)
        {
            this.camera = camera;
        }

        public void Initialize()
        {
            camera.ZoomIn(1f);
        }

        public void SetTarget(BaseObject target)
        {
            this.target = target;
        }

        public void Update(GameTime time)
        {
            if (target != null)
            {
                Vector2 offset = camera.Center - camera.Position;

                camera.Position = target.Position - offset;
            }
        }
    }
}
